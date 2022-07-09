import {
  ProjectCreated,
  ConstituentAdded,
} from './types/SplashProject/SplashProject';
import { SplashProject } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';

export function handleProjectCreated(event: ProjectCreated): void {
  let projectId = event.params.projectId.toString();
  let creatorAddress = event.params.creator.toHex();

  getOrCreateAccount(creatorAddress);

  let project = new SplashProject(projectId);
  project.creator = creatorAddress;
  project.price = event.params.price;
  project.constituents = [];
  project.save();
}

export function handleConstituentAdded(event: ConstituentAdded): void {
  let projectId = event.params.projectId.toString();
  let constituentId = event.params.constituentId.toString();

  let project = SplashProject.load(projectId);

  project!.constituents!.push(constituentId);
  project!.save();
}
