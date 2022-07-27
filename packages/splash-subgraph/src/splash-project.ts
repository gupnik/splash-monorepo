import {
  ProjectCreated,
  ConstituentAdded,
  ProjectURIUpdated,
} from './types/SplashProject/SplashProject';
import { SplashLink, SplashProject } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';
import { ipfs, json, JSONValue } from '@graphprotocol/graph-ts';

export function handleProjectCreated(event: ProjectCreated): void {
  let projectId = event.params.projectId.toString();
  let creatorAddress = event.params.creator.toHex();

  let account = getOrCreateAccount(creatorAddress, true, false);

  let project = new SplashProject(projectId);
  project.creator = creatorAddress;
  project.price = event.params.price;
  project.uri = event.params.uri;

  let metadata = ipfs.cat(project.uri.replace("ipfs://", ""));
  if (metadata) {
    const value = json.fromBytes(metadata).toObject();
    if (value) {
      const image = value.get('image');
      const name = value.get('name');
      const description = value.get('description')
      // const tags = value.get('tags')

      if (name && image && description) {
        project.name = name.toString();
        project.image = image.toString();
        project.description = description.toString()
        project.tags = []; //tags != null ? tags.toArray().map<string>((x: JSONValue) => x.toString()) : []
      }
    }
  }

  project.updatedAtTimestamp = event.block.timestamp;
  project.save();

  account.save();
}

export function handleProjectURIUpdated(event: ProjectURIUpdated): void {
  let projectId = event.params.projectId.toString();

  let project = SplashProject.load(projectId);

  project!.uri = event.params.uri;

  let metadata = ipfs.cat(project!.uri.replace("ipfs://", ""));
  if (metadata) {
    const value = json.fromBytes(metadata).toObject();
    if (value) {
      const image = value.get('image');
      const name = value.get('name');
      const description = value.get('description')
      // const tags = value.get('tags')

      if (name && image && description) {
        project!.name = name.toString();
        project!.image = image.toString();
        project!.description = description.toString()
        project!.tags = []; //tags != null ? tags.toArray().map<string>((x: JSONValue) => x.toString()) : []
      }
    }
  }

  project!.updatedAtTimestamp = event.block.timestamp

  project!.save();
}


export function handleConstituentAdded(event: ConstituentAdded): void {
  let projectId = event.params.projectId.toString();
  let constituentId = event.params.constituentId.toString();

  let link = new SplashLink(`${projectId}:${constituentId}`);
  link.project = projectId;
  link.constituent = constituentId;
  link.txIndex = event.transaction.index;
  link.blockNumber = event.block.number;
  link.blockTimestamp = event.block.timestamp;
  link.save();
}
