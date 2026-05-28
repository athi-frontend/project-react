export const EQUIPMENT_INFO_TEXT = {
  MAJOR_DESCRIPTION: `Key process equipment, machines, hardware are regularly maintained in accordance with maintenance plans specified by equipment manufacturers or technical personnel responsible for the equipment. The maintenance of equipment’s is also ensured by calibration process (Ref.: BNMD/SOP 27)`,
  PLANNED_DESCRIPTION: `      
        Key process equipment, machines, hardware are regularly maintained in accordance with maintenance plans specified by equipment manufacturers or technical personnel responsible for the equipment. The maintenance of equipment is also ensured by the calibration process.
        PMT Incharge is responsible for maintenance of all the monitoring and measuring equipment used in the company. Any equipment that is out of working order is identified by affixing a suitable sticker or other appropriate marking.
        After maintenance, equipment will be re-calibrated. A record of the maintenance performed is maintained.
        Whenever inspection and measuring equipment is found to be out of calibration, a label with an “under calibration” tag will be affixed.
    `,
  MEASURING_DEVICES: `
        PMT Incharge is responsible for arranging the calibration of the monitoring and measuring devices. All equipment used in the company are identified and listed. Equipment requiring calibration is identified and listed defining their capability, range, and other details.
        Equipment are calibrated at periodical intervals to ensure and maintain their accuracy and reliability for continued fitness for use.
        Frequency of calibration is yearly, and if any equipment is damaged or has undergone repair, intermediate calibration will be performed to prove its accuracy.
        Calibration of equipment is carried out either by external agencies. It is ensured that the equipment calibrated by external agencies is traceable to the national or international standards, where available and practical.
        Record of calibration is maintained. Calibration status of all the equipment (defining date of calibration, next calibration due, and calibrated by) is recorded.
      
    `
}

export const EQUIPMENT_FORM_TITLE = 'Equipment';

export const EQUIPMENT_FIELD_NAMES = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  EQUIPMENT_DESCRIPTION: 'production_qc_equipment_description',
  MAINTENANCE_DESCRIPTION: 'preventive_maintenance_description',
  CALIBRATION_DESCRIPTION: 'measuring_device_calibration',
} as const;

export const EQUIPMENT_FORM_FIELDS_CONFIG = {
  EQUIPMENT_DESCRIPTION: {
    label: 'Brief Description of Major Production and Quality Control Laboratories Equipment',
    placeholder: 'Input Text',
    infoText: EQUIPMENT_INFO_TEXT.MAJOR_DESCRIPTION,
    field: EQUIPMENT_FIELD_NAMES.EQUIPMENT_DESCRIPTION,
  },
  MAINTENANCE_DESCRIPTION: {
    label: 'Description of Planned Preventive Maintenance',
    placeholder: 'Input Text',
    infoText: EQUIPMENT_INFO_TEXT.PLANNED_DESCRIPTION,
    field: EQUIPMENT_FIELD_NAMES.MAINTENANCE_DESCRIPTION,
  },
  CALIBRATION_DESCRIPTION: {
    label: 'Calibration of Monitoring and Measuring Devices',
    placeholder: 'Input Text',
    infoText: EQUIPMENT_INFO_TEXT.MEASURING_DEVICES,
    field: EQUIPMENT_FIELD_NAMES.CALIBRATION_DESCRIPTION,
  },
} as const;

const EQUIPMENT_BASE_URL = 'api/v1/regulation/equipment'

export const EQUIPMENT_API_ENDPOINTS = {
  FETCH: (organization_site_id: number) => `${EQUIPMENT_BASE_URL}/${organization_site_id}`,
  CREATE: EQUIPMENT_BASE_URL,
};

export const EQUIPMENT_RESPONSE_KEYS = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  EQUIPMENT_DESCRIPTION: 'production_qc_equipment_description',
  MAINTENANCE_DESCRIPTION: 'preventive_maintenance_description',
  CALIBRATION_DESCRIPTION: 'measuring_device_calibration',
} as const;