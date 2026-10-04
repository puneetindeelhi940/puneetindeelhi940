using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace LaerdalUx.Screensaver;

/// <summary>
/// Windows screensaver entry point. Windows launches a .scr with:
///   /s            run full screen
///   /p &lt;hwnd&gt;    draw a preview inside the Screen Saver Settings dialog
///   /c[:hwnd]     show settings (also used when the file is double-clicked)
/// </summary>
internal static class Program
{
    internal const string HostName = "ux.portal";
    internal static readonly string DataRoot =
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "LaerdalUxScreensaver");

    [STAThread]
    private static void Main(string[] args)
    {
        ApplicationConfiguration.Initialize();
        var (mode, handle) = ParseArgs(args);

        switch (mode)
        {
            case "/s":
                RunFullScreen();
                break;
            case "/p":
                if (handle != IntPtr.Zero) Application.Run(new PreviewForm(handle));
                break;
            default:
                MessageBox.Show(
                    "Laerdal UX Discovery Screensaver\n\n" +
                    "Plays the UX Discovery & Framing motion scenes in random order.\n\n" +
                    "To use: right-click LaerdalUX.scr → Install, or pick \"LaerdalUX\" in\n" +
                    "Settings → Personalisation → Lock screen → Screen saver.\n\n" +
                    "Requires the Microsoft Edge WebView2 Runtime (built into Windows 11).\n\n" +
                    "Built by Puneet Arora.",
                    "Laerdal UX Screensaver", MessageBoxButtons.OK, MessageBoxIcon.Information);
                break;
        }
    }

    private static (string mode, IntPtr handle) ParseArgs(string[] args)
    {
        if (args.Length == 0) return ("/c", IntPtr.Zero);
        var first = args[0].Trim().ToLowerInvariant();
        string mode = first.Length >= 2 ? first[..2] : first;
        string? value = first.Length > 3 ? first[3..] : (args.Length > 1 ? args[1] : null);
        IntPtr h = long.TryParse(value, out var n) ? new IntPtr(n) : IntPtr.Zero;
        return (mode, h);
    }

    private static void RunFullScreen()
    {
        string portal;
        try { portal = ExtractPortal(); }
        catch (Exception ex)
        {
            MessageBox.Show("Could not prepare screensaver files:\n" + ex.Message, "Laerdal UX Screensaver");
            return;
        }

        Cursor.Hide();
        var forms = Screen.AllScreens.Select(s => new ScreenForm(s.Bounds, portal)).ToList();
        foreach (var f in forms.Skip(1)) f.Show();
        Application.Run(forms[0]);
    }

    /// <summary>Copies the embedded portal files to %LOCALAPPDATA% so WebView2 can serve them.</summary>
    private static string ExtractPortal()
    {
        var asm = Assembly.GetExecutingAssembly();
        var dir = Path.Combine(DataRoot, "portal-" + (asm.GetName().Version?.ToString() ?? "1"));
        foreach (var name in asm.GetManifestResourceNames().Where(n => n.StartsWith("portal/")))
        {
            var rel = name["portal/".Length..].Replace('\\', '/');
            var target = Path.GetFullPath(Path.Combine(dir, rel.Replace('/', Path.DirectorySeparatorChar)));
            if (!target.StartsWith(Path.GetFullPath(dir), StringComparison.OrdinalIgnoreCase)) continue;
            Directory.CreateDirectory(Path.GetDirectoryName(target)!);
            using var src = asm.GetManifestResourceStream(name)!;
            using var dst = File.Create(target);
            src.CopyTo(dst);
        }
        return dir;
    }
}

/// <summary>One borderless, top-most window per monitor hosting the portal's screensaver page.</summary>
internal sealed class ScreenForm : Form
{
    private readonly string _portal;
    private readonly WebView2 _web = new() { Dock = DockStyle.Fill, DefaultBackgroundColor = Color.FromArgb(7, 21, 18) };
    private readonly System.Windows.Forms.Timer _mouseWatch = new() { Interval = 250 };
    private Point _startMouse;
    private readonly DateTime _started = DateTime.UtcNow;

    public ScreenForm(Rectangle bounds, string portal)
    {
        _portal = portal;
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.Manual;
        Bounds = bounds;
        TopMost = true;
        ShowInTaskbar = false;
        BackColor = Color.FromArgb(7, 21, 18);
        KeyPreview = true;
        Controls.Add(_web);

        KeyDown += (_, _) => Quit();
        MouseDown += (_, _) => Quit();
        Load += async (_, _) => await InitAsync();

        // Backup exit path: WebView2 swallows some mouse input, so poll the cursor.
        _startMouse = Cursor.Position;
        _mouseWatch.Tick += (_, _) =>
        {
            if ((DateTime.UtcNow - _started).TotalSeconds < 2) { _startMouse = Cursor.Position; return; }
            var p = Cursor.Position;
            if (Math.Abs(p.X - _startMouse.X) + Math.Abs(p.Y - _startMouse.Y) > 12) Quit();
        };
        _mouseWatch.Start();
    }

    private async Task InitAsync()
    {
        try
        {
            var env = await CoreWebView2Environment.CreateAsync(null, Path.Combine(Program.DataRoot, "WebView2Data"));
            await _web.EnsureCoreWebView2Async(env);
            var core = _web.CoreWebView2;
            core.Settings.AreDefaultContextMenusEnabled = false;
            core.Settings.AreDevToolsEnabled = false;
            core.Settings.IsStatusBarEnabled = false;
            core.Settings.IsZoomControlEnabled = false;
            core.SetVirtualHostNameToFolderMapping(Program.HostName, _portal, CoreWebView2HostResourceAccessKind.Allow);
            core.WebMessageReceived += (_, e) => { if (e.TryGetWebMessageAsString() == "exit") Quit(); };
            // Links in the scenes must never navigate the screensaver away.
            core.NewWindowRequested += (_, e) => e.Handled = true;
            core.Navigate($"https://{Program.HostName}/screensaver.html?ss=1");
        }
        catch (WebView2RuntimeNotFoundException)
        {
            Controls.Clear();
            Controls.Add(new Label
            {
                Dock = DockStyle.Fill, TextAlign = ContentAlignment.MiddleCenter,
                ForeColor = Color.FromArgb(207, 237, 227), Font = new Font("Segoe UI", 18),
                Text = "Microsoft Edge WebView2 Runtime is required.\nAsk IT to install it, or download it from microsoft.com."
            });
        }
    }

    private static void Quit()
    {
        Cursor.Show();
        Application.Exit();
    }
}

/// <summary>Lightweight preview drawn inside the Screen Saver Settings dialog.</summary>
internal sealed class PreviewForm : Form
{
    [DllImport("user32.dll")] private static extern IntPtr SetParent(IntPtr child, IntPtr parent);
    [DllImport("user32.dll")] private static extern int SetWindowLong(IntPtr hWnd, int index, int value);
    [DllImport("user32.dll")] private static extern int GetWindowLong(IntPtr hWnd, int index);
    [DllImport("user32.dll")] private static extern bool GetClientRect(IntPtr hWnd, out RECT rect);
    [StructLayout(LayoutKind.Sequential)] private struct RECT { public int Left, Top, Right, Bottom; }
    private const int GWL_STYLE = -16, WS_CHILD = 0x40000000;

    private readonly System.Windows.Forms.Timer _tick = new() { Interval = 80 };
    private readonly Random _rng = new();
    private readonly int[] _drops = new int[40];

    public PreviewForm(IntPtr parent)
    {
        FormBorderStyle = FormBorderStyle.None;
        BackColor = Color.FromArgb(11, 31, 27);
        DoubleBuffered = true;
        ShowInTaskbar = false;
        Load += (_, _) =>
        {
            SetParent(Handle, parent);
            SetWindowLong(Handle, GWL_STYLE, GetWindowLong(Handle, GWL_STYLE) | WS_CHILD);
            GetClientRect(parent, out var r);
            Bounds = new Rectangle(0, 0, r.Right - r.Left, r.Bottom - r.Top);
        };
        _tick.Tick += (_, _) => { for (int i = 0; i < _drops.Length; i++) _drops[i] = (_drops[i] + _rng.Next(1, 3)) % 40; Invalidate(); };
        _tick.Start();
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        using var green = new SolidBrush(Color.FromArgb(63, 184, 160));
        using var small = new Font("Consolas", 6f);
        int step = Math.Max(4, Width / _drops.Length);
        for (int i = 0; i < _drops.Length; i++)
            e.Graphics.DrawString(((char)_rng.Next(0x30A0, 0x30FF)).ToString(), small, green, i * step, _drops[i] * Height / 40f);
        using var title = new Font("Segoe UI", 9f, FontStyle.Bold);
        using var cream = new SolidBrush(Color.FromArgb(243, 241, 234));
        e.Graphics.DrawString("Laerdal UX", title, cream, 6, Height - 22);
    }
}
