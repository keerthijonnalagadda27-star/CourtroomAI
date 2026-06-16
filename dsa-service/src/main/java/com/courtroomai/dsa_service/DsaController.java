package com.courtroomai.dsa_service;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController

@CrossOrigin(origins="*")
@RequestMapping("/dsa")


public class DsaController {
    private PrecedentGraph precedentGraph=new PrecedentGraph();
    private IpcTrie ipcTrie=new IpcTrie();

    @GetMapping("/health")

    public Map<String,String>health(){
        Map<String,String> response=new HashMap<>();
        response.put("status: ","DSA service is running...");
        response.put("service: ","CourtRoomAI DSA");
        return response;
//                spring automatically converts this map into json

    }

    @PostMapping("/precedents")
    public Map<String,Object>getPrecedents(@RequestBody Map<String,String>body){
        String question=body.get("question");
//        getting here the question from the request body...
        List<LegalCase>precedents=precedentGraph.findRelevantPrecedents(question);
//        building the response...
        List<Map<String,Object>> precedentList=new ArrayList<>();

        for(LegalCase legalCase:precedents){
            Map<String,Object> caseMap=new HashMap<>();
            caseMap.put("caseId", legalCase.getCaseId());
            caseMap.put("title", legalCase.getTitle());
            caseMap.put("summary", legalCase.getSummary());
            caseMap.put("year", legalCase.getYear());
            caseMap.put("category", legalCase.getCategory());
            precedentList.add(caseMap);
        }
        Map<String,Object> response=new HashMap<>();
        response.put("question", question);
        response.put("precedents", precedentList);
        response.put("count", precedentList.size());
        return response;
    }
    @GetMapping("/ipc-search")
//    get request query parameter tho ichinappudu..if caleed like:=
//     /dsa/ipc-search?query=420
    public Map<String,Object>searchIpc(@RequestParam String query){
        List<String>results=ipcTrie.search(query);
        Map<String,Object>response=new HashMap<>();
        response.put("query",query);
        response.put("results",results);
        response.put("count",results.size());
        return response;
    }
    @PostMapping("/bfs")
//    this is the endpoint to do bfs from a specific case

    public Map<String,Object>doBfs(@RequestBody Map<String,String>body){
        String caseId=body.get("caseId");
        int depth=Integer.parseInt(body.getOrDefault("depth","2"));

        List<LegalCase>results=precedentGraph.bfsTraversal(caseId,depth);

        List<Map<String,Object>> resultList=new ArrayList<>();
        for(LegalCase legalCase:results){
            Map<String,Object> caseMap=new HashMap<>();
            caseMap.put("caseId", legalCase.getCaseId());
            caseMap.put("title", legalCase.getTitle());
            caseMap.put("summary", legalCase.getSummary());
            caseMap.put("year", legalCase.getYear());
            caseMap.put("category", legalCase.getCategory());
            resultList.add(caseMap);
        }
        Map<String,Object> response=new HashMap<>();
        response.put("startCase",caseId);
        response.put("depth",depth);
        response.put("relatedCases",resultList);
        return response;
    }
}
