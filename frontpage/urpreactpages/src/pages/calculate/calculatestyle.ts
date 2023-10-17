import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useCalculateStyles = makeStyles((theme: Theme) =>
    createStyles({
        CalculateRoot: {
            width: '100%',
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        nextButton:{
            backgroundColor:"#409eff"
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        StepLabel:{

        },
        buttonsDiv:{
          marginTop:50,
        }
    }),
);