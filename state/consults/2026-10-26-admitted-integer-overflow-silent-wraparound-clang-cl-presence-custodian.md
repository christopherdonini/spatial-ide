# O1: clang-cl's presence on the development machine and on the Windows runner image — the custodian's check

*The custodian's own check, 2026-10-26, by the human's resent direction (`state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md`, item 1: whether clang-cl is on this machine and whether the Windows runner image lists it). Everything below was run in the custodian's session; the outputs are summarised in the custodian's words, with file names copied.*

## The development machine

- `where clang-cl`: no match.
- No `C:/Program Files/LLVM` folder.
- The Visual Studio Build Tools 2022 install has a `VC/Tools/Llvm` folder, but it holds only these executables: `ARM64/bin/clang-format.exe`, `ARM64/bin/clang-tidy.exe`, `bin/clang-format.exe`, `bin/clang-tidy.exe`, `x64/bin/clang-format.exe`, `x64/bin/clang-tidy.exe`. No `clang-cl.exe` and no `clang.exe`: the C++ Clang compiler component is not installed.
- **So clang-cl is not on this machine.** Route (a)'s probe needs it installed first (the Visual Studio component that provides the C++ Clang compiler, or LLVM); a change to the machine, so the human's word.

## The Windows runner image

- `.github/workflows/product-ci-rust.yml` runs its Windows cell on `windows-latest`.
- The public runner-image software lists (read through the GitHub API, read only): Windows Server 2025 (image version 20261021.299.1) and Windows Server 2022 (20261022.344.1) each list LLVM 20.1.8 among their tools and the Visual Studio components Microsoft.VisualStudio.Component.VC.Llvm.Clang and Microsoft.VisualStudio.Component.VC.Llvm.ClangToolset.
- **So the runner image carries clang-cl**: CI installs nothing new for route (a).
