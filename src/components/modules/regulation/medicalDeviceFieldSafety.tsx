import React from 'react';

const MedicalDeviceFieldSafety: React.ReactNode = (
  <>
    <div>The product can be recalled from the market due to following reasons:</div>
    <ul>
      <li>Customer complaint</li>
      <li>In-house observations</li>
    </ul>
    <div>Category - Category 1</div>
    <div>Description: This includes a customer complaint / internal observation regarding Packaging problem in a batch.</div>
    <div>Recall Strategy: In case of category 1 problem, depending upon the gravity of the problem in packaging and the degree of health hazard involved, the material is immediately stopped from dispatch. The concerned personnel are immediately informed and deputed to attend the concerned Hospitals/institutions. The material is immediately withdrawn from the market and required corrective and preventive action is initiated.</div>
    <div>Category - Category 2</div>
    <div>Description: This includes a customer complaint / internal observation regarding Labeling problem in a batch.</div>
    <div>Recall Strategy: In case of category 2 complaint, if the whole lot of the supplied product is verified using controlled samples and there is no change in labeling, this is communicated to the relevant user or distributor. However, if the same type of complaint/problem has been observed from more than 5 different locations, then the product is immediately withdrawn from the market.</div>
    <div>Category - Category 3</div>
    <div>Description: This includes a customer complaint / internal observation regarding product failure problem in a batch.</div>
    <div>Recall Strategy: In case of category 3 complaint, the material may or may not be recalled depending upon customer requirement. Corrective and preventive action is however initiated.</div>
    <div>The advisory notices are the details which are required & to be provided by the manufacturer for:</div>
    <ul>
      <li>Making the user aware of how to use the device</li>
      <li>If there are any requirements to make modifications in the device</li>
      <li>If there is a requirement to destroy the device due to any specific reason</li>
      <li>The advisory notices for the use of the medical devices are provided on the labels and also in the instructions for use supplied with each device.</li>
    </ul>
    <div>In case modification is required and it cannot be done by the user, the products may have to be recalled or an advisory notice can be issued to explain how to destruct and dispose of the device.</div>
    <div>In the event of any product failure or malfunctioning, the company shall intimate the concerned authority. The company will issue the advisory notices to this effect as and when required.</div>
  </>
);

export default MedicalDeviceFieldSafety;
