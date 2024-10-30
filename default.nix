let
  # Pinned nixpkgs, deterministic. Last updated: 29-10-2024.
  pkgs = import (fetchTarball ("https://github.com/NixOS/nixpkgs/archive/0930fa9bab0e3877d4ab0682f805b2dc86ec5716.tar.gz")) { };

  # Rolling updates, not deterministic.
  # pkgs = import (fetchTarball ("channel:nixpkgs-unstable")) { };
in
pkgs.mkShell {
  name = "revoltEnv";

  buildInputs = [
    # Tools
    pkgs.git

    # Node
    pkgs.nodejs
    pkgs.nodejs.pkgs.pnpm

    # mdbook
    pkgs.mdbook
    pkgs.mdbook-mermaid
  ];
}
