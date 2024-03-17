let
  # Pinned nixpkgs, deterministic. Last updated: 11-08-2023.
  pkgs = import (fetchTarball("https://github.com/NixOS/nixpkgs/archive/bb9707ef2ea4a5b749b362d5cf81ada3ded2c53f.tar.gz")) {};

  # Rolling updates, not deterministic.
  # pkgs = import (fetchTarball("channel:nixpkgs-unstable")) {};
in pkgs.mkShell {
  name = "revoltEnv";

  buildInputs = [
    # Tools
    pkgs.git

    # Node
    pkgs.nodejs
    pkgs.nodejs.pkgs.pnpm
  ];
}