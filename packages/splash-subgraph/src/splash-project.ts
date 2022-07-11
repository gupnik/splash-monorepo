import {
  ProjectCreated,
  ConstituentAdded,
  ProjectURIUpdated,
} from './types/SplashProject/SplashProject';
import { SplashProject } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleProjectCreated(event: ProjectCreated): void {
  let projectId = event.params.projectId.toString();
  let creatorAddress = event.params.creator.toHex();

  let account = getOrCreateAccount(creatorAddress, true, false);

  let project = new SplashProject(projectId);
  project.creator = creatorAddress;
  project.price = event.params.price;
  project.uri = event.params.uri;
  project.constituents = [];
  project.save();

  let projects = account.projects;
  projects!.push(projectId);
  account.projects = projects;
  account.save();
}

export function handleProjectURIUpdated(event: ProjectURIUpdated): void {
  let projectId = event.params.projectId.toString();

  let project = SplashProject.load(projectId);

  project!.uri = event.params.uri;
  project!.save();
}


export function handleConstituentAdded(event: ConstituentAdded): void {
  let projectId = event.params.projectId.toString();
  let constituentId = event.params.constituentId.toString();

  let project = SplashProject.load(projectId);

  project!.constituents!.push(constituentId);
  project!.save();
}
