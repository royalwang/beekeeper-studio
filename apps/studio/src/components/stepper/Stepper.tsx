import React, { useState, useEffect } from 'react';

interface Step {
  title: string;
  component: React.ComponentType<any>;
  deactivated?: boolean;
  stepperProps?: any;
  validation?: () => boolean | Promise<boolean>;
}

interface StepperProps {
  steps: Step[];
  currentStepIndex?: number;
  onStepChange?: (stepIndex: number) => void;
  onFinish?: () => void;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex: controlledStepIndex,
  onStepChange,
  onFinish,
  className = '',
}) => {
  const [internalStepIndex, setInternalStepIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const currentStepIndex = controlledStepIndex !== undefined ? controlledStepIndex : internalStepIndex;
  const currentStep = steps[currentStepIndex];

  const stepperClasses = `stepper ${className}`.trim();
  const contentClass = 'stepper-content';

  const goToStep = async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    const targetStep = steps[stepIndex];
    if (targetStep.deactivated) return;

    // Run validation for current step before moving
    if (currentStep.validation) {
      setIsValidating(true);
      try {
        const isValid = await currentStep.validation();
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch (error) {
        console.error('Step validation failed:', error);
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    if (controlledStepIndex === undefined) {
      setInternalStepIndex(stepIndex);
    }
    onStepChange?.(stepIndex);
  };

  const nextStep = async () => {
    if (currentStepIndex < steps.length - 1) {
      await goToStep(currentStepIndex + 1);
    } else {
      onFinish?.();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const runValidation = async (showErrors: boolean = false) => {
    if (currentStep.validation) {
      setIsValidating(true);
      try {
        const isValid = await currentStep.validation();
        setIsValidating(false);
        return isValid;
      } catch (error) {
        console.error('Step validation failed:', error);
        setIsValidating(false);
        return false;
      }
    }
    return true;
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={stepperClasses}>
      <div className="top">
        <div className="nav-pills">
          {steps.map((step, index) => (
            <div
              key={index}
              className={step.deactivated ? 'deactivated' : ''}
            >
              <div
                className={`progress ${index <= currentStepIndex ? 'passed' : ''}`}
              >
                &nbsp;
              </div>
              <button
                className={`nav-pill ${index === currentStepIndex ? 'active' : ''} ${step.deactivated ? 'deactivated' : ''}`}
                onClick={() => goToStep(index)}
                disabled={step.deactivated || isValidating}
              >
                {index + 1 > currentStepIndex && !step.deactivated && `${index + 1}.`}
                {index + 1 <= currentStepIndex && (
                  <i className="material-icons pill-icon">check</i>
                )}
                {step.deactivated && (
                  <i className="material-icons pill-icon">clear</i>
                )}
                {step.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={contentClass}>
        {currentStep && (
          <div className="step-content">
            <currentStep.component
              stepperProps={currentStep.stepperProps || {}}
              onChange={() => runValidation(true)}
              onFinish={nextStep}
              onNext={nextStep}
              onPrevious={previousStep}
              currentStep={currentStepIndex}
              totalSteps={steps.length}
              isValidating={isValidating}
            />
          </div>
        )}
      </div>

      <div className="stepper-actions">
        <div className="action-buttons">
          {currentStepIndex > 0 && (
            <button
              className="btn btn-secondary"
              onClick={previousStep}
              disabled={isValidating}
            >
              <i className="material-icons">arrow_back</i>
              Previous
            </button>
          )}
          
          <div className="step-info">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          
          {currentStepIndex < steps.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={nextStep}
              disabled={isValidating}
            >
              Next
              <i className="material-icons">arrow_forward</i>
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onFinish}
              disabled={isValidating}
            >
              <i className="material-icons">check</i>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
