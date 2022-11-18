const main = async () => {
    const pollContractFactory = await hre.ethers.getContractFactory("poll");
    const pollContract = await pollContractFactory.deploy();
    await pollContract.deployed(); 

console.log("Contract address: ",pollContract.address);
};

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
    };
    
    runMain();