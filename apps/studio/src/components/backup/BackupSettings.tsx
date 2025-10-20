import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import FilePicker from '../common/form/FilePicker';
import { CommandSettingControl, CommandSettingSection } from '../../lib/db/models';
import _ from 'lodash';

const BackupSettings: React.FC = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.backups.settingsConfig);
  const supportedFeatures = useSelector((state: RootState) => state.backups.supportedFeatures);
  const database = useSelector((state: RootState) => state.global.database);
  
  const [sections, setSections] = useState<CommandSettingSection[]>([]);

  useEffect(() => {
    // Load settings sections from store
    const settingsSections = useSelector((state: RootState) => state.backups.settingsSections);
    setSections(settingsSections);
  }, []);

  const callIfFunction = (value: any): any => {
    if (_.isFunction(value)) {
      return value(config);
    } else {
      return value;
    }
  };

  const onNext = async () => {
    await dispatch({ type: 'backups/updateConfig', payload: config });
    await dispatch({ type: 'backups/setDatabase', payload: database });
  };

  const canContinue = () => {
    let cont = true;
    const controls = _.flatten(sections.map((x) => x.controls));
    const required = controls.filter((c: CommandSettingControl) => 
      c.required && (!c.show || c.show(config))
    );
    required.forEach((c: CommandSettingControl) => {
      cont = cont && !!config[c.settingName] && (!c.valid || c.valid(config));
    });
    return cont;
  };

  const onChange = (control: CommandSettingControl) => {
    // if the control needs to do any changes to other parts of the config when it changes.
    if (control?.onValueChange) control.onValueChange(config);

    // Force settings that have a show method to be redrawn.
    const needsUpdate: [CommandSettingSection, number][] = sections
      .map((s, i) => [s, i])
      .filter((s) => s[0].show != undefined || s[0].controls.some((c) => c.show != undefined));
    
    needsUpdate.forEach((value) => {
      setSections(prev => prev.map((section, index) => 
        index === value[1] ? { ...value[0] } : section
      ));
    });

    // We only emit a change event when the field that was changed is required.
    if (control?.required) {
      // Emit change event if needed
    }
  };

  const clearControl = (settingName: string) => {
    const newConfig = { ...config, [settingName]: null };
    dispatch({ type: 'backups/updateConfig', payload: newConfig });
    onChange({} as CommandSettingControl);
  };

  const handleAction = async (actionOnClick: any, control: CommandSettingControl): Promise<void> => {
    if (!actionOnClick) return;
    await actionOnClick(config);
    onChange(control);
  };

  const filePickerOptions = { 
    buttonLabel: 'Choose Directory', 
    properties: ['openDirectory', 'createDirectory'] 
  };

  const controls = _.flatten(sections.map((x) => x.controls));

  return (
    <div className="backup-wrapper small-wrap">
      <div className="backup-content">
        {config != null && sections != null && (
          <form>
            <div className="page-content flex-col">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="row">
                  {(!section.show || section.show(config)) && (
                    <div className="card-flat padding section expand">
                      <div className="flex flex-between">
                        <h3 className="card-title">
                          {section.header}
                        </h3>
                      </div>
                      {section.controls.map((control, index) => (
                        <div key={index}>
                          {(!control.show || control.show(config)) && (
                            <>
                              {control.controlType === 'select' && (
                                <div className="form-group">
                                  <label htmlFor={control.settingName}>
                                    {control.settingDesc + (control.required ? '*' : '')}
                                  </label>
                                  <div className="input-group">
                                    <select
                                      name={control.settingName}
                                      className={`form-control custom-select ${config[control.settingName] ? 'selected' : ''}`}
                                      id={control.settingName}
                                      onChange={(e) => {
                                        const newConfig = { ...config, [control.settingName]: e.target.value };
                                        dispatch({ type: 'backups/updateConfig', payload: newConfig });
                                        onChange(control);
                                      }}
                                      value={config[control.settingName] || ''}
                                    >
                                      <option disabled hidden value="">
                                        {control.placeholder}
                                      </option>
                                      {control.selectOptions?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                          {option.name}
                                        </option>
                                      ))}
                                    </select>
                                    {!control.required && (
                                      <div className="input-group-append">
                                        <button
                                          type="button"
                                          className="btn btn-flat"
                                          onClick={() => clearControl(control.settingName)}
                                        >
                                          <i className="material-icons">clear</i>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {control.controlType === 'checkbox' && (
                                <div className="form-group">
                                  <label htmlFor={control.settingName} className="checkbox-group">
                                    <input
                                      type="checkbox"
                                      name={control.settingName}
                                      className="form-control"
                                      id={control.settingName}
                                      onChange={(e) => {
                                        const newConfig = { ...config, [control.settingName]: e.target.checked };
                                        dispatch({ type: 'backups/updateConfig', payload: newConfig });
                                        onChange(control);
                                      }}
                                      checked={config[control.settingName] || false}
                                    />
                                    <span>{control.settingDesc + (control.required ? '*' : '')}</span>
                                  </label>
                                </div>
                              )}

                              {control.controlType === 'filepicker' && (
                                <div className="form-group">
                                  <label htmlFor={control.settingName}>
                                    {control.settingDesc + (control.required ? '*' : '')}
                                  </label>
                                  <FilePicker
                                    value={config[control.settingName]}
                                    onChange={(value) => {
                                      const newConfig = { ...config, [control.settingName]: value };
                                      dispatch({ type: 'backups/updateConfig', payload: newConfig });
                                      onChange(control);
                                    }}
                                    options={control.controlOptions}
                                    buttonText={control.placeholder}
                                    actions={control.actions?.filter((a) => !a.show || a.show(config)).map((action, aIndex) => (
                                      <div key={aIndex} className="input-group-append">
                                        <button
                                          type="button"
                                          className="btn btn-flat"
                                          title={action.tooltip}
                                          disabled={callIfFunction(action.disabled)}
                                          onClick={() => handleAction(action.onClick, control)}
                                        >
                                          {action.icon && (
                                            <i className="material-icons btn-icon">
                                              {callIfFunction(action.icon)}
                                            </i>
                                          )}
                                          {action.value && <span>{callIfFunction(action.value)}</span>}
                                        </button>
                                      </div>
                                    ))}
                                  />
                                </div>
                              )}

                              {control.controlType === 'input' && (
                                <div className="form-group">
                                  <label htmlFor={control.settingName}>
                                    {control.settingDesc + (control.required ? '*' : '')}
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      name={control.settingName}
                                      id={control.settingName}
                                      onChange={(e) => {
                                        const newConfig = { ...config, [control.settingName]: e.target.value };
                                        dispatch({ type: 'backups/updateConfig', payload: newConfig });
                                        onChange(control);
                                      }}
                                      value={config[control.settingName] || ''}
                                    />
                                    {!control.required && (
                                      <div className="input-group-append">
                                        <button
                                          type="button"
                                          className="btn btn-flat"
                                          onClick={() => clearControl(control.settingName)}
                                        >
                                          <i className="material-icons">clear</i>
                                        </button>
                                      </div>
                                    )}
                                    {control.actions?.map((action, aIndex) => (
                                      <div key={aIndex} className="input-group-append">
                                        <button
                                          type="button"
                                          className="btn btn-flat"
                                          title={action.tooltip}
                                          disabled={callIfFunction(action.disabled)}
                                          onClick={() => handleAction(action.onClick, control)}
                                        >
                                          {action.icon && (
                                            <i className="material-icons">
                                              {callIfFunction(action.icon)}
                                            </i>
                                          )}
                                          {action.value && <span>{callIfFunction(action.value)}</span>}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {control.controlType === 'textarea' && (
                                <div className="form-group">
                                  <label htmlFor={control.settingName}>
                                    {control.settingDesc + (control.required ? '*' : '')}
                                  </label>
                                  <textarea
                                    name={control.settingName}
                                    cols={30}
                                    rows={5}
                                    className="gutter textarea"
                                    onChange={(e) => {
                                      const newConfig = { ...config, [control.settingName]: e.target.value };
                                      dispatch({ type: 'backups/updateConfig', payload: newConfig });
                                      onChange(control);
                                    }}
                                    value={config[control.settingName] || ''}
                                  />
                                </div>
                              )}

                              {control.controlType === 'header' && (
                                <div className="form-group">
                                  <hr />
                                  <h3>{control.settingDesc}</h3>
                                </div>
                              )}

                              {control.controlType === 'info' && (
                                <div className="form-group">
                                  <div className="info-alert alert text-info">
                                    <div className="alert-body">
                                      <div>
                                        {control.settingDesc}
                                        {control.infoLink && (
                                          <a
                                            className="info-link"
                                            href={control.infoLink}
                                          >
                                            {control.infoLinkText}
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BackupSettings;
