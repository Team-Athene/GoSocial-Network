// solium-disable linebreak-style
pragma solidity 0.6.1;

contract fms {
  //Structures :
  //Structure that stores the File Details
  struct fileDetails{
    string fileName;
    string hashValue;
  }

  //Mappings :
  //File ID for each address(user)
  mapping(address=>uint) public id;
  //Number of Deleted Files in each address
  mapping(address=>uint) public delId;
  //Mapping the files in each address with their respective File ID
  mapping(address => mapping(uint => fileDetails)) public fileHash;

  //Functions :
  //To Upload a file
  function setFile(string calldata _fileName, string calldata _fileHash) external {
    fileHash[msg.sender][id[msg.sender]].fileName = _fileName;
    fileHash[msg.sender][id[msg.sender]].hashValue = _fileHash;
    id[msg.sender]++;
  }
  //To Delete a File
  function deleteFile(uint _id) external {
    delete fileHash[msg.sender][_id];
    delId[msg.sender]++;
  }
}