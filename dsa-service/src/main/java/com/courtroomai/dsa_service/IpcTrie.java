package com.courtroomai.dsa_service;

import org.jspecify.annotations.NonNull;

import java.util.*;

public class IpcTrie {
    private static class TrieNode {
        HashMap<Character, TrieNode> children;
        String sectionInfo;

        boolean isEndOfSection;

        TrieNode() {
            children = new HashMap<>();
            sectionInfo = null;
            isEndOfSection = false;
        }
    }
    private TrieNode root;
    public IpcTrie(){
        root=new TrieNode();
        buildTrie();
    }

    public void insert(String sectionNumber,String sectionInfo){
        TrieNode current=root;
        for(char ch:sectionNumber.toCharArray()){
            current.children.putIfAbsent(
                    ch,
                    new TrieNode()
            );
            current=current.children.get(ch);

        }
        current.isEndOfSection=true;
        current.sectionInfo=sectionInfo;
    }
    public List<String> search(String prefix) {
        List<String> results = new ArrayList<>();
        TrieNode current = root;

        for (char ch : prefix.toCharArray()) {
            if (!current.children.containsKey(ch)) {
                return results;
            }
            current = current.children.get(ch);
        }
        collectSections(current, results);
        return results;
    }

    private void collectSections(TrieNode node,List<String>results){
            if (node.isEndOfSection) {
                results.add(node.sectionInfo);
            }
            for (TrieNode child : node.children.values()) {
                collectSections(child, results);
            }

        }
        private void buildTrie(){
            insert("302", "Section 302 IPC — Punishment for Murder. Whoever commits murder shall be punished with death or imprisonment for life.");
            insert("304", "Section 304 IPC — Culpable Homicide not amounting to Murder.");
            insert("307", "Section 307 IPC — Attempt to Murder.");
            insert("354", "Section 354 IPC — Assault or criminal force on woman with intent to outrage modesty.");
            insert("376", "Section 376 IPC — Punishment for Rape.");
            insert("379", "Section 379 IPC — Punishment for Theft. Imprisonment up to 3 years or fine or both.");
            insert("380", "Section 380 IPC — Theft in dwelling house.");
            insert("392", "Section 392 IPC — Punishment for Robbery.");
            insert("395", "Section 395 IPC — Punishment for Dacoity.");
            insert("403", "Section 403 IPC — Dishonest misappropriation of property.");
            insert("405", "Section 405 IPC — Criminal breach of trust.");
            insert("406", "Section 406 IPC — Punishment for Criminal Breach of Trust. Imprisonment up to 3 years.");
            insert("415", "Section 415 IPC — Cheating defined.");
            insert("420", "Section 420 IPC — Cheating and dishonestly inducing delivery of property. Imprisonment up to 7 years.");
            insert("447", "Section 447 IPC — Punishment for Criminal Trespass.");
            insert("498", "Section 498 IPC — Enticing or taking away or detaining with criminal intent a married woman.");
            insert("498A", "Section 498A IPC — Husband or relative of husband subjecting woman to cruelty.");
            insert("499", "Section 499 IPC — Defamation defined.");
            insert("500", "Section 500 IPC — Punishment for Defamation. Imprisonment up to 2 years.");
            insert("504", "Section 504 IPC — Intentional insult provoking breach of peace.");
            insert("506", "Section 506 IPC — Punishment for Criminal Intimidation.");
            insert("509","Section 509 IPC - Word,gesture or act intended to insult modesty of a woman.");

    }
    
}
