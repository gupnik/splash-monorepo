import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useEthers } from '@usedapp/core';
import Davatar from '@davatar/react';
import classes from './ShortAddress.module.css';
import { ProjectState } from '../../state/slices/project';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

const ProjectCard: React.FC<{ project: ProjectState }> = props => {
  const { uri } = props.project;
  const [projectData, setProjectData] = useState<any>({});

  useEffect(() => {
    const loadProjectData = async () => {
      setProjectData(await (await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"))).json());
    }

    loadProjectData();
  }, [uri])

  return <>
      <Card>
        <Card.Img src={projectData.image ? projectData.image.replace("ipfs://", "https://ipfs.io/ipfs/") : null} />
        <Card.Body>
          <Card.Title>Project Name</Card.Title>
          <Card.Text>
            Project Description
          </Card.Text>
          <Button variant="primary">Open</Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card></>;
};

export default ProjectCard;
