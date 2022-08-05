import { ProjectState } from '../../state/slices/project';
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material"
import { useContractFunction } from '@usedapp/core';
import { SplashProjectFactory } from '@splash/sdk';
import config from "../../config";

const ProjectCard: React.FC<{ project: ProjectState, title: string, showBuy: boolean, showConstituentCount?: boolean, showRemixCount?: boolean, onClose?: (description: string, price: string) => Promise<void> }> = props => {
  const { id, price, name, description, image, consumers, supply, constituents } = props.project;

  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const { send: buyProject, state: buyProjectState } = useContractFunction(
    splashProjectContract,
    'buy',
  );

  return (
    <Grid item>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            sx={{ width: 200, height: 200, objectFit: 'contain' }}
            image={image.replace("ipfs://", "https://ipfs.io/ipfs/")}
          />
          <CardContent style={{ backgroundColor: "lightgray" }}>
            <Typography gutterBottom variant="body2" component="div" textAlign={"center"}>
                {name}
            </Typography>
            {/* <Typography gutterBottom variant="body2" component="div" textAlign={"center"}>
                {`Remix Count: ${consumers.length}`}
            </Typography> */}
            {/* <Typography gutterBottom variant="body2" component="div" textAlign={"center"}>
                {`Price: ${price}`}
            </Typography> */}
          </CardContent>
          <CardActions style={{ justifyContent: 'space-between' }}>
            <Button size="small" color="primary" onClick={() => {
              props.onClose && props.onClose(description, price);
            }}>
            {props.title}{props.showRemixCount &&`(${consumers.length})`}{props.showConstituentCount &&`(${constituents.length})`}
            </Button>
            {props.showBuy ? 
            (<Button size="small" color="primary" onClick={() => {
              buyProject(id)
            }}>
            {buyProjectState.status === "Mining" ? "Mining" : `Buy(${supply})`}
            </Button>) :
            <div />}
          </CardActions>
        </Card>
    </Grid>
  )
};

export default ProjectCard;
