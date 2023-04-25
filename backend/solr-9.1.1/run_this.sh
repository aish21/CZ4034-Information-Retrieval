curl -X POST -H 'Content-type:application/json' --data-binary '{
  "replace-field":{
     "name":"text",
     "type":"text_en_splitting"}
}' http://localhost:8983/solr/test_solr_2/schema