(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['itemHistory'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<section class = \"history-item\">\r\n  <section class=\"history-date\"><span class=\"date\">Data: </span>"
    + alias4(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date","hash":{},"data":data}) : helper)))
    + "</section>\r\n  <section class=\"history-consumption\"><span class=\"consumption-amount\">Consumption: </span>"
    + alias4(((helper = (helper = helpers.consumption || (depth0 != null ? depth0.consumption : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"consumption","hash":{},"data":data}) : helper)))
    + "</section>\r\n  <button type=\"button-history\" class=\"modal-close-button\">&times;</button>\r\n</section>\r\n";
},"useData":true});
})();