class quickSort{
public static void sort(int []arr,int s,int e){
    if(s>=e){
  return;
    }
  int q=partition(arr,s,e);
  sort(arr,s,q-1);
  sort(arr,q+1,e);

}

public static int partition(int []arr,int s,int e){
 int lastElement=arr[e];
 int i=s-1;
 for(int j=s;j<e;j++){
    if(arr[j]<lastElement){
        i++;
        int temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
 }
 i++;
 int temp=arr[i];
 arr[i]=arr[e];
 arr[e]=temp;
 return i;
 
}

    public static void main(String[] args) {
        int []arr= {-1,-2,77,90,3,2,7,4,5,0,-100};
        int s=0;
        int e=arr.length-1;
        sort(arr,s,e);

        for(int i=0;i<arr.length;i++){
            System.out.print(arr[i]+" ");
        }
    }
    }