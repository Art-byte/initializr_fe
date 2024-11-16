import {Dependencies} from "./dependencies";
import {Type} from "./type";
import {Packaging} from "./packaging";
import {JavaVersion} from "./java-version";
import {Language} from "./language";
import {BootVersion} from "./boot-version";

export class BuildData {
  dependencies: Dependencies;
  type: Type;
  packaging: Packaging;
  javaVersion: JavaVersion;
  language: Language;
  bootVersion: BootVersion;
  groupId: string;
  artifactId: string;
  version: string;
  name: string;
  description: string;
  packageName: string;
}
