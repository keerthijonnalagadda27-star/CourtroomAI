package com.courtroomai.dsa_service;

import java.util.*;

public class PrecedentGraph {
    private HashMap<String,LegalCase> cases;
    private HashMap<String, List<String>>adjacencyList;
    public PrecedentGraph() {
        cases = new HashMap<>();

        adjacencyList = new HashMap<>();
        buildGraph();
    }
    public void addCase(LegalCase legalCase) {
        cases.put(legalCase.getCaseId(),legalCase);
        adjacencyList.put(legalCase.getCaseId(),new ArrayList<>());
    }
    public void addCitation(String fromCaseId,String toCaseId) {
        if(adjacencyList.containsKey(fromCaseId)) {
            adjacencyList.get(fromCaseId).add(toCaseId);
        }
    }
    public List<LegalCase> bfsTraversal(String startCaseId,int maxDepth){
        List<LegalCase>result=new ArrayList<>();
        if(!cases.containsKey(startCaseId)){
            return result;
        }
        Set<String>visited=new HashSet<>();

        Queue<String[]> queue=new LinkedList<>();
        queue.add(new String[]{startCaseId,"0"});
//        caseid,depth ni store cheyadaniki we took a string array
        visited.add(startCaseId);

        while(!queue.isEmpty()){
            String current[]=queue.poll();

            String currentId=current[0];
            int currentDepth=Integer.parseInt(current[1]);

            if(currentDepth>0) {
                result.add(cases.get(currentId));
            }
            if(currentDepth<maxDepth){
                List<String>neighbors=adjacencyList.get(currentId);
                if(neighbors!=null){
                    for(String neighborId:neighbors){
                        if(!visited.contains(neighborId)){
                            visited.add(neighborId);
                            queue.add(new String[]{neighborId,String.valueOf(currentDepth+1)});

                        }
                    }
                }
            }
        }
        return result;
    }
    public List<LegalCase> findByCategory(String category){
        List<LegalCase> result=new ArrayList<>();
        for(LegalCase legalCase:cases.values()){
            if(legalCase.getCategory().equalsIgnoreCase(category)){
                result.add(legalCase);
            }
        }
        result.sort((a,b)->b.getYear()-a.getYear());

        return result.size()>3 ? result.subList(0,3):result;
    }
    public List<LegalCase>findRelevantPrecedents(String question){
        String questionLower=question.toLowerCase();

        String category;

        if (questionLower.contains("deposit") || questionLower.contains("rent") ||
                questionLower.contains("landlord") || questionLower.contains("tenant") ||
                questionLower.contains("property")) {
            category = "property";
        } else if (questionLower.contains("consumer") || questionLower.contains("product") ||
                questionLower.contains("builder") || questionLower.contains("service")) {
            category = "consumer";
        } else {
            category = "criminal";
        }
        List<LegalCase> relevant=findByCategory(category);
        if(!relevant.isEmpty()){
            List<LegalCase>cited=bfsTraversal(relevant.get(0).getCaseId(),2);
            for(LegalCase c:cited){
                if(!relevant.contains(c)){
                    relevant.add(c);
                }
            }
        }
        return relevant.size()>4?relevant.subList(0,4):relevant;
    }
    private void buildGraph(){
        LegalCase c1 = new LegalCase("SC-1963-001",
                "Associated Hotels of India v. R.N. Kapoor",
                "Landmark case defining difference between lease and license",
                1963, "property");

        LegalCase c2 = new LegalCase("SC-1994-002",
                "Bachhaj Nahar v. Nilima Mandal",
                "Security deposit must be returned within reasonable time",
                1994, "property");

        LegalCase c3 = new LegalCase("SC-2001-003",
                "Satyabrata Ghose v. Mugneeram Bangur",
                "Tenant rights and landlord obligations under rent control",
                2001, "property");

        LegalCase c4 = new LegalCase("SC-2015-004",
                "Hindustan Petroleum v. Dilbahar Singh",
                "Deposit refund with interest when withheld without reason",
                2015, "property");

        // CONSUMER cases
        LegalCase c5 = new LegalCase("SC-1995-005",
                "Spring Meadows Hospital v. Harjol Ahluwalia",
                "Landmark consumer protection — service deficiency standards",
                1995, "consumer");

        LegalCase c6 = new LegalCase("SC-2009-006",
                "Lucknow Development Authority v. M.K. Gupta",
                "Government authorities liable under consumer protection",
                2009, "consumer");

        LegalCase c7 = new LegalCase("SC-2019-007",
                "Pioneer Urban Land v. Govindan Raghavan",
                "Builder liable for delay — consumer forum has jurisdiction",
                2019, "consumer");

        // CRIMINAL cases
        LegalCase c8 = new LegalCase("SC-1958-008",
                "Dr. Vimla v. Delhi Administration",
                "Defining cheating under IPC Section 420 — intent essential",
                1958, "criminal");

        LegalCase c9 = new LegalCase("SC-1980-009",
                "State of Maharashtra v. Mohd. Yakub",
                "Criminal breach of trust — misappropriation definition",
                1980, "criminal");

        LegalCase c10 = new LegalCase("SC-2003-010",
                "Hira Lal Hari Lal Bhagwati v. CBI",
                "Fraud and misrepresentation — ingredients of cheating",
                2003, "criminal");

        for(LegalCase c:new LegalCase[]{c1,c2,c3,c4,c5,c6,c7,c8,c9,c10}){
            addCase(c);
        }
        addCitation("SC-2015-004", "SC-1994-002");
        addCitation("SC-2015-004", "SC-2001-003");
        addCitation("SC-2001-003", "SC-1963-001");
        addCitation("SC-1994-002", "SC-1963-001");
        addCitation("SC-2019-007", "SC-2009-006");
        addCitation("SC-2009-006", "SC-1995-005");
        addCitation("SC-2003-010", "SC-1980-009");
        addCitation("SC-2003-010", "SC-1958-008");
        addCitation("SC-1980-009", "SC-1958-008");
    }
    

}
