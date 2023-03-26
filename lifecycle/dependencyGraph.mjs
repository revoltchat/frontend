import { exec } from "node:child_process";

exec("pnpm list -r", (err, stdout) => {
  const lines = stdout.split("\n");

  // prepare a filter
  const pkgFilter = (name) => name.startsWith("@revolt");

  // skip first two lines
  for (let i = 0; i < 2; i++) lines.shift();

  // keep track of what we are reading
  let pkg = null;
  let readDependency = null;
  let dependencies = {};
  let pkgs = {};

  function toPkgName(str) {
    let segments = str.split(" ").shift().split("@");
    segments.pop();
    return segments.join("@");
  }

  function savePkg() {
    pkgs[pkg] = dependencies;
    dependencies = {};
  }

  // read all packages
  for (const line of lines) {
    if (pkg) {
      if (line.trim()) {
        if (readDependency) {
          const dependency = line.split(" ").shift();
          if (pkgFilter(dependency))
            dependencies[readDependency] = [
              ...(dependencies[readDependency] ?? []),
              dependency,
            ];
        } else {
          if (line.startsWith("dependencies")) {
            readDependency = "dependencies";
          } else if (line.startsWith("devDependencies")) {
            readDependency = "devDependencies";
          } else {
            savePkg();
            pkg = toPkgName(line);
          }
        }
      } else {
        readDependency = null;
      }
    } else {
      pkg = toPkgName(line);
    }
  }

  savePkg();

  // * convert to graphviz output
  console.info(`
digraph mygraph {
node [shape=box];
${Object.keys(pkgs)
  .filter(pkgFilter)
  .filter((pkg) => pkgs[pkg].dependencies)
  .map((pkg) =>
    pkgs[pkg].dependencies
      .map((depends_on) => `"${depends_on}" -> "${pkg}"`)
      .join("\n")
  )
  .join("\n")}
}
`);
});
