{
  pkgs ? import <nixpkgs> { },
}:

with pkgs;
mkShell {
  name = "revoltEnv";

  buildInputs = [
    # Tools
    git
    gh
    deno

    # Node
    nodejs
    nodejs.pkgs.pnpm

    # mdbook
    mdbook
    mdbook-mermaid

    # Tauri
    pkg-config
    gobject-introspection
    cargo
    rustc
    rustfmt
    at-spi2-atk
    atkmm
    cairo
    gdk-pixbuf
    glib
    gtk3
    harfbuzz
    librsvg
    libsoup_3
    pango
    webkitgtk_4_1
    openssl
    xdg-utils
    gst_all_1.gstreamer
    gst_all_1.gst-plugins-base
    gst_all_1.gst-plugins-good
    gst_all_1.gst-plugins-bad
    gst_all_1.gst-libav
    gst_all_1.gst-plugins-ugly
    gst_all_1.gst-libav
    libappindicator-gtk3
  ];

  GIO_MODULE_DIR = "${glib-networking}/lib/gio/modules/";
  LD_LIBRARY_PATH = "${libayatana-appindicator}/lib";
  RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
}
