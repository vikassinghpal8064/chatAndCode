public class mergeSort2 {
public static void divide(int []arr,int s,int e){
 if(s>=e){
  return;
 }
  int mid=s+(e-s)/2;
  divide(arr,s,mid);
  divide(arr,mid+1,e);
  merge(arr,s,mid,e);
}
     
  public static void merge(int []arr,int s,int mid,int e){
 int size1= mid-s+1;
 int size2=e-mid;
 int []left = new int [size1];
 int []right= new int[size2];
 for(int i=0;i<left.length;i++){
  left[i]=arr[s+i];
  
  }
  for(int i=0;i<right.length;i++){
  right[i]=arr[mid+i+1];
  
  }
  int i=0;
  int j=0;
  int k=s;
  while(i<size1 && j<size2){
    if(left[i]<right[j]){
      arr[k]=left[i];
      i++;
    }
    else{
      arr[k]=right[j];
      j++;
    }
    k++;
  }
  while(i<size1){
    arr[k]=left[i];
    k++;
    i++;
  }
  while(j<size2){
    arr[k]=right[j];
    k++;
    j++;
  }
    
  }
    public static void main(String []argv){
    int []arr= {-1,-2,77,90,3,2,7,4,5,0};
   int s=0;
   int e=arr.length-1;
   int mid=s+(e-s)/2;
   divide(arr,s,e);
for(int i=0;i<arr.length;i++){
  System.out.print(arr[i]+" ");
}
  
    }
 }
     


