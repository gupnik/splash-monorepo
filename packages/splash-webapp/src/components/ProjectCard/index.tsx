import { ProjectState } from '../../state/slices/project';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const ProjectCard: React.FC<{ project: ProjectState }> = props => {
  const { uri } = props.project;
  const history = useHistory();
  const [projectData, setProjectData] = useState<any>({});

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"), {
          // mode: 'no-cors'
        });
        const data = await response.json();
        setProjectData(data);   
      } catch (error) {
        
      }
    }

    loadProjectData();
  }, [uri])

  return <>
      <Card>
        <Card.Img src={projectData.image ? projectData.image.replace("ipfs://", "https://ipfs.io/ipfs/") : null} />
        <Card.Body>
          <Card.Title>{projectData["name"]}</Card.Title>
          <Card.Text>
          {projectData["description"]}
          </Card.Text>
          <Button variant="primary" onClick={() => history.push("/project")}>Open</Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    </>;
};

export default ProjectCard;
