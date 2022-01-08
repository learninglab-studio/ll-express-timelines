const Airtable = require(`airtable`);

module.exports.addRecord = async function(options){
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(options.baseId);
  var airtableResult = await base(options.table).create(options.record).then(result => {
    console.log("saved to airtable");
    return result;
  })
    .catch(err => {
      console.log("\nthere was an error with the AT push\n");
      console.error(err);
      return;
    });
  return airtableResult   
}
  
module.exports.findManyByValue = async function(options) {
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(options.baseId);
  const theRecords = [];
  var queryOptions = {
    maxRecords: options.maxRecords ? options.maxRecords : 10,
    view: options.view ? options.view : "MAIN_VIEW",
    filterByFormula: `${options.field}="${options.value}"`
  }
  const result = await base(options.table).select(queryOptions).eachPage(function page(records, next){
     theRecords.push(...records);
    //  console.log(JSON.stringify(records))
     next()
  })
  .catch(err=>{console.error(err); return})
  return theRecords;
}

  