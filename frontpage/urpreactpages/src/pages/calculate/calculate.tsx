import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import {useCalculateStyles} from './calculatestyle'
import IdfSelector from "../../components/idfselector";
import EpwSelector from "../../components/epwselector";
import RootStore from "../../store/store";
import { observer } from "mobx-react-lite";


function getSteps() {
    return ['选择场景','选择气象数据', '设置参数'];
}

function getStepContent(stepIndex: number) {
    switch (stepIndex) {
        case 0:
            return <IdfSelector/>;
        case 1:
            return <EpwSelector/>;
        case 2:
            return '设置参数';
        default:
            return 'Unknown stepIndex';
    }
}

const Calculate=observer(()=> {
    const classes = useCalculateStyles();
    const [activeStep, setActiveStep] = React.useState<number>(0);
    const steps = getSteps();
    const next=((activeStep===0 && RootStore.idfStore.idfObject.Id ===0)||(activeStep===1 && RootStore.epwStore.epwObject.Id ===0))

    // console.log(next)
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
            <Stepper activeStep={activeStep} style={{backgroundColor:"#f8f9fa"}} alternativeLabel>
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
                                返回
                            </Button>
                            <Button variant="contained" disabled={next} color="primary" onClick={handleNext} className={classes.nextButton}>
                                {activeStep === steps.length - 1 ? '开始计算' : '下一个'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
})

export default Calculate