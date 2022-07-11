// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract SplashProject is
    ERC1155,
    Ownable
{
    using SafeMath for uint256;
    using Strings for uint256;
    
    address proxyRegistryAddress;
    string placeholderURI = "ipfs://QmVFKiZ48nq9F343UY4Ykiirnfqd4MYm8Qydz1ifGbbR6C";

    string public name;
    string public symbol;

    struct SplashProjectInfo {
        uint256 id;
        address creator;
        uint256 price;
        uint256 currentSupply;
        string uri;
        uint256[] constituents;
        uint256 numConstituents;
    }

    event ProjectCreated(uint256 indexed projectId, address creator, uint256 price, string uri);
    event ProjectURIUpdated(uint256 indexed projectId, string uri);
    event ConstituentAdded(uint256 indexed projectId, uint256 indexed constituentId);

    mapping(uint256 => SplashProjectInfo) public projects;
    uint256 public numProjects;

    constructor(
        string memory name_,
        string memory symbol_,
        address proxyRegistryAddress_
    ) ERC1155("ipfs:///{id}.json") { 
        name = name_;
        symbol = symbol_;
        proxyRegistryAddress = proxyRegistryAddress_;
    }

    function uri(uint256 tokenId) override public view returns (string memory) {
        return projects[tokenId].uri;
    }

    function create(uint256 price) public {
        SplashProjectInfo memory projectInfo;
        projectInfo.id = numProjects.add(1);
        projectInfo.creator = msg.sender;
        projectInfo.price = price;
        projectInfo.uri = placeholderURI;
        projects[projectInfo.id] = projectInfo;
        numProjects = numProjects.add(1);
        _mint(msg.sender, projectInfo.id, 1, "");
        emit ProjectCreated(projectInfo.id, msg.sender, price, placeholderURI);
    }

    function updateURI(uint256 projectId, string memory projectURI) public {
        SplashProjectInfo storage projectInfo = projects[projectId];
        require(projectInfo.creator == msg.sender, "You cannot edit this project");
        projects[projectId].uri = projectURI;
        emit ProjectURIUpdated(projectId, projectURI);
    }

    function add(uint256 constituentId, uint256 projectId) public payable {
        SplashProjectInfo storage projectInfo = projects[projectId];
        require(projectInfo.creator == msg.sender, "You cannot edit this project");
        SplashProjectInfo storage constituentInfo = projects[constituentId];
        require(constituentInfo.creator != address(0), "Project does not exist");
        require(
            constituentInfo.price <= msg.value,
            "Value sent is not correct"
        );
        _mint(msg.sender, constituentId, 1, "");
        constituentInfo.currentSupply = constituentInfo.currentSupply.add(1);
        projectInfo.constituents.push(constituentId);
        projectInfo.numConstituents = projectInfo.numConstituents.add(1);
        emit ConstituentAdded(projectInfo.id, constituentInfo.id);
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
       if (_operator == address(proxyRegistryAddress)) {
            return true;
        }
        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    function contractURI() public view returns (string memory) {
        return placeholderURI;
    }
}
