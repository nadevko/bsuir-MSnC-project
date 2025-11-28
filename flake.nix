{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    nabiki = {
      url = "github:nadevko/nabiki/v2-alpha";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      treefmt-nix,
      nabiki,
      nixpkgs,
    }@inputs:
    let
      private = final: prev: { inherit inputs; };
    in
    nabiki.lib.mapAttrsNested nixpkgs.legacyPackages (
      pkgs:
      let
        treefmt = treefmt-nix.lib.evalModule pkgs {
          programs.nixfmt = {
            enable = true;
            strict = true;
          };
          programs.prettier.enable = true;
        };
      in
      rec {
        legacyPackages = pkgs.extend (_: _: packages);
        packages = inputs.nabiki.lib.rebase self.overlays.default pkgs;
        devShells = nabiki.lib.rebase (nabiki.lib.readDevShellsOverlay { } private ./pkgs) pkgs;
        formatter = treefmt.config.build.wrapper;
        checks.treefmt = treefmt.config.build.check self;
        apps.default = {
          type = "app";
          program = nixpkgs.lib.getExe (legacyPackages.callPackage ./pkgs/default/app.nix { });
        };
      }
    )
    // {
      overlays.default = nabiki.lib.readPackagesOverlay { } private ./pkgs;
    };
}
