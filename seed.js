const { db, models } = require("./server/db");
const { Students } = require("./server/db/models");
const fs = require("fs").promises;

const readFileAsync = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf-8")
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const seed = async () => {
  try {
    await db.sync({ force: true });

    const firstNameData = await readFileAsync("firstNames.txt");
    const firstNames = firstNameData.split("\r\n");

    console.log("FIRST NAMES:\n", firstNames);

    const lastNameData = await readFileAsync("lastNames.txt");

    //windows: \r\n   ,  unix: \n but I produced the file in notepad so...
    const lastNames = lastNameData.split("\r\n");

    console.log("LAST NAMES:\n", lastNames);

    const maxClasses = lastNames.length - 1;
    let classMap = [];

    //just trying to assign a last name randomly to first names and doing it 6 times
    //so we can jack up the unique number of first/last name combinations
    const numBins = 6;
    for (let i = 0; i < numBins; i++) {
      classMap.push(
        firstNames.map((name) => Math.trunc(Math.random() * maxClasses))
      );
    }

    let mergeNames = [];
    for (let j = 0; j < numBins; j++) {
      for (let i = 0; i < firstNames.length - 1; i++) {
        mergeNames.push(firstNames[i] + " " + lastNames[classMap[j][i]]);
      }
    }

    //use an object to create unique list
    const uniqueStudents = mergeNames.sort().reduce((prev, cur) => {
      return { ...prev, [cur]: 1 };
    }, {});

    //console.log('unique:',uniqueStudents)

    const finalStudents = Object.keys(uniqueStudents).map((student) =>
      student.split(" ")
    );
    //console.log(finalStudents)
    //finalStudents[0] is first name, finalStudents[1] is last name

    const numCampuses = 3;
    const campus1 = await models.Campuses.create({
      name: "Junior D&D Training",
      address: "35 Main Street, Towne of Marne",
      description: "Learn new feats in your character class",
      xCoord: 31, yCoord: 9 
    });

    const campus2 = await models.Campuses.create({
      name: "Senior D&D Training",
      address: "The Beholder Mountains Campsite and Caverns",
      description: "Learn how to find the Ultimate Paragon Path",
      xCoord: 52, yCoord: 60 
    });

    const campus3 = await models.Campuses.create({
      name: "Island School of Dungeoneering",
      address: "The Pirate Isle of Blight",
      description: "Learn secret tricks of the trade",
      xCoord: 2, yCoord:58
    })

    for (let i = 0; i < finalStudents.length; i++) {
      const [firstName, lastName] = finalStudents[i];
      const email =
        String(firstName).toLowerCase() +
        "@" +
        String(lastName).toLowerCase() +
        ".dnd";
      const gpa = Math.min(Math.random() * 5, 4.0);
      const newStudent = await Students.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        gpa: gpa,
      });
      const campusNum = Math.trunc(Math.random() * numCampuses) + 1;
      const setCampus = await newStudent.setCampus(campusNum);
    }
  } catch (err) {
    console.log(err);
  }
};

// If this module is being required from another module, then we just export the
// function, to be used as necessary. But it will run right away if the module
// is executed directly (e.g. `node seed.js` or `npm run seed`)

async function runSeed() {
  try {
    await seed();
    console.log("Seeding success!");
  } catch (err) {
    console.error("Oh noes! Something went wrong!");
    console.error(err);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  runSeed();
}
