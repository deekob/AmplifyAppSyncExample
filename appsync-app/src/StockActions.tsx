import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = createStyles({
    card: {
        maxWidth: 600
    }
});

interface Props extends WithStyles<typeof styles> {
    company_name: string,
    company_description: string,
    onAction: () => {},
    simulate: boolean,
    onSimulate: () => {}
}

const StockActions = (props: Props) => {
    return(
        <Card className={props.classes.card}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        { props.company_name }
                    </Typography>
                    <Typography component="p">
                        { props.company_description }
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" onClick={props.onAction}>
                    Buy
                </Button>
                <Button size="small" color="primary" onClick={props.onAction}>
                    Sell
                </Button>   
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={props.simulate}
                                onChange={props.onSimulate}
                                aria-label="SimulateSwitch" />
                        }
                        label="Simulate Market"
                    />
                </FormGroup>             
            </CardActions>
        </Card>
    ) 
};

export default withStyles(styles)(StockActions);