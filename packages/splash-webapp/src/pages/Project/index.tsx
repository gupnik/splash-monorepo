import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import { Button, Card, CardGroup, CardImg, Row } from "react-bootstrap";
import ProjectCard from "../../components/ProjectCard";
import config from "../../config";
import { useAppSelector } from "../../hooks";
// import Designer, {Text, Rect} from '@splash/designer';
import Designer from "../../designer/Designer";
import { Rect, Text} from "../../designer/objects";
import { useState } from "react";
import { useHistory } from "react-router-dom";

interface ProjectPageProps {
  
}

const ProjectPage: React.FC<ProjectPageProps> = props => {
  const history = useHistory();

  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const projects = useAppSelector(state => state.projects.projects);

  const { send: createProject, state: createProjectState } = useContractFunction(
    splashProjectContract,
    'create',
  );

  const [objects, setObjects] = useState<any>([
    // {type: "text", x: 10, y: 20, text: "Hello!", fill: "red"},
    {type: "rect", x: 50, y: 50, width: 50, height: 50, fill: "red"}
  ])

  return (
    <>
    <Designer 
      width={250} height={350}
      objectTypes={{
        'text': Text,
        'rect': Rect
      }}
      onUpdate={(objects: any) => {setObjects(objects)}}
      objects={objects}/>
    <Button onClick={() => history.goBack()}>Exit</Button>
    </>
  )
}

export default ProjectPage;