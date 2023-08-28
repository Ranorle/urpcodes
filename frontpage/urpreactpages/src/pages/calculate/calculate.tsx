import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useCalculateStyles} from './calculatestyle'
import IdfSelector from "../../components/idfselector";

function getSteps() {
    return ['选择场景','选择天气', '设置参数'];
}

function getStepContent(stepIndex: number) {
    switch (stepIndex) {
        case 0:
            return <IdfSelector/>;
        case 1:
            return '选择天气';
        case 2:
            return '设置参数';
        default:
            return 'Unknown stepIndex';
    }
}

export default function Calculate() {
    const classes = useCalculateStyles();
    const [activeStep, setActiveStep] = React.useState<number>(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className={classes.CalculateRoot}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel >{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <div className={classes.instructions}>All steps completed</div>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        <div className={classes.instructions}>{getStepContent(activeStep)}</div>
                        <div>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.backButton}
                            >
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className={classes.nextButton}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
