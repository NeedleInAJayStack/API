import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
class Api {
  /**
   * Builds an image of this repo
   */
  @func()
  buildFromDockerfile(directory: Directory): Container {
    return dag
      .container()
      .build(directory)
  }

  @func()
  buildBase(directory: Directory): Container {
    return dag
      .container()
      .from("swift:latest")
      .withWorkdir("/build")
      .withDirectory(".", directory)
      .withExec(["swift", "package", "resolve"])
  }

  @func()
  buildRelease(directory: Directory): Container {
    const staging = this.buildBase(directory)
      .withExec(["swift", "build", "-c", "debug"])
      .withWorkdir("/staging")
      .withExec(["bash", "-c", "cp \"$(swift build --package-path /build -c debug --show-bin-path)/Run\" ./"])
      .withExec(["bash", "-c", "[ -d /build/Public ] && { mv /build/Public ./Public && chmod -R a-w ./Public; } || true"])
      .withExec(["bash", "-c", "[ -d /build/Resources ] && { mv /build/Resources ./Resources && chmod -R a-w ./Resources; } || true"])
      .directory("./")

    return dag.container()
      .from("swift:slim")
      .withExec(["useradd", "--user-group", "--create-home", "--system", "--skel", "/dev/null", "--home-dir", "/app", "vapor"])
      .withWorkdir("/app")
      .withDirectory("/app", staging)
      .withUser("vapor")
      .withExposedPort(8080)
      .withEntrypoint(["./Run"])
      .withDefaultTerminalCmd(["serve", "--env", "production", "--hostname", "0.0.0.0", "--port", "8080"])
  }
}
