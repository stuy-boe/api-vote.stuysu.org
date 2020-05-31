const {students} = require("./../../../database");
const {expect} = require("chai");

describe("students", () => {
    
    const grade = -1;
    const email ="email@example.com";
    let fakeStudent;

    before( async () => {
        fakeStudent = await students.create({
            email,
            grade
        });
    });

    describe("#getGrade", () => {

        it("should return the student's grade", async () => {
            expect(await students.getGrade(email)).to.equal(grade);
        });

        it("should return null if an email doesn't exist", async () => {
            expect(await students.getGrade("")).to.be.null;
        });
    });

    after(async () => {
        fakeStudent.destroy();
    });
});