import {
  ProjectCreated,
  ConstituentAdded,
  ProjectURIUpdated,
  ProjectPriceUpdated,
  TransferSingle,
} from './types/SplashProject/SplashProject';
import { SplashLink, SplashProject } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';
import { Address, ipfs, json, JSONValue, log } from '@graphprotocol/graph-ts';
import { BIGINT_ONE, BIGINT_ZERO } from './utils/constants';

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
      const tags = value.get('tags')

      if (name && image && description) {
        project.name = name.toString();
        project.image = image.toString();
        project.description = description.toString()
        if (tags) {
          project.tags = tags.toString();
        } else {
          project.tags = "";
        }
      }
    }
  }

  project.supply = BIGINT_ZERO;
  project.updatedAtTimestamp = event.block.timestamp;
  project.save();

  account.save();
}

export function handleProjectPriceUpdated(event: ProjectPriceUpdated): void {
  let projectId = event.params.projectId.toString();

  let project = SplashProject.load(projectId);

  project!.price = event.params.price;
  project!.updatedAtTimestamp = event.block.timestamp

  project!.save();
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
      const tags = value.get('tags')

      if (name && image && description) {
        project!.name = name.toString();
        project!.image = image.toString();
        project!.description = description.toString()
        if (tags) {
          project!.tags = tags.toString();
        } else {
          project!.tags = "";
        }
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

export function handleTransferSingle(event: TransferSingle): void {
  let projectId = event.params.id.toString();
  let from = event.params.from.toHex();
  if (from.localeCompare(Address.empty().toHexString())) {
    let project = SplashProject.load(projectId);
    project!.supply = project!.supply.plus(BIGINT_ONE);
    project!.save();
  }
}
