package LinkedList;

import java.util.*;
import java.util.LinkedList;

public class KthElement {
    public static void main(String[] args) {
       Integer [] strArr = { 1, 3, 4 ,44,101};
        List<Integer> list = Arrays.asList(strArr);
        LinkedList<Integer> linkedList = new LinkedList<>(list);
        System.out.println("LinkedList of the above array: " + linkedList);
    }
}
