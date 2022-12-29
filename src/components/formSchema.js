export function formSchema(tableConfig) {
  
  const fields = Object.keys(tableConfig);
  const numFields = fields.length;
  const init = "";
  const nullState = Array(numFields).fill(init);

  let isRequired = {};
  let requiredFields = [];
  let isNum = [];

  for (const [field, fieldDef] of Object.entries(tableConfig)) {

    if (
      typeof fieldDef["allowNull"] !== "undefined" &&
      fieldDef["allowNull"] === false
    ) {
      isRequired[field] = 1;
      requiredFields.push(field); //slightly redundant but makes validation loop quicker
    } else {
      isRequired[field] = 0;
    }

    //we need to reset numeric fields to null if they were left empty
    if (fieldDef["type"] == 2) {
      //see StudentConfig.js, sorry
      isNum.push(true);
    } else {
      isNum.push(false);
    }
  }

  return { fields, isRequired, isNum, nullState, numFields }
}
