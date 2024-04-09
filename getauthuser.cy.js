describe('Get the authenticated user - Failure & Pass Test Cases', function(){

  //Fetch access token from the test data file
  beforeEach(function(){
      cy.fixture('testData.json').as('testData');
      cy.fixture('GitHubToken.json').as('tokenData');
    });

    it('TC-01 Verify the API will return 401 Unauthorized if we do not provide any token', function(){
      cy.get('@tokenData').then(function(tokenData){
        const { blankToken } = tokenData;
        cy.request({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ${blankToken}', // Provide an invalid GitHub token here
            'X-GitHub-Api-Version': '2022-11-28'
          },
          failOnStatusCode: false,
          withCredentials: true
          }).then((response) => {
              expect(response.status).to.eq(401);
              expect(response.statusText).to.eq("Unauthorized")
              expect(response.body.message).to.eq("Bad credentials"); 
          });
      })
    });

    it('TC-02 Verify the API will return 401 Unauthorized if we provide an invalid token', function(){
      cy.get('@tokenData').then(function(tokenData){
        const { invalidToken } = tokenData;
        cy.request({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ${invalidToken}', // Provide an invalid GitHub token here
            'X-GitHub-Api-Version': '2022-11-28'
          },
          failOnStatusCode: false,
          withCredentials: true
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.statusText).to.eq("Unauthorized")
            expect(response.body.message).to.eq("Bad credentials"); 
        });
      })
    });

    //Need to findout how to generate the token without permission
    it('TC-03 Verify the API will return 403 Forbidden if we provide Token Without Necessary Permissions', function(){
      cy.get('@tokenData').then(function(tokenData){
        const { restrictedToken } = tokenData;
        cy.request({
            method: 'GET',
            url: 'https://api.github.com/user',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ${restrictedToken}',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            failOnStatusCode: false,
            withCredentials: true
        }).then((response) => {
            expect(response.status).to.eq(403); // Expecting a 403 status code
        });
    });
    
    });

    it('TC-04 Verify the API will return 200 OK if we provide a valid access token', function(){
      cy.get('@tokenData').then(function(tokenData){
        const { validToken } = tokenData;
        cy.request({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ${validToken}', //Provide valid token
            'X-GitHub-Api-Version': '2022-11-28'
          },
          failOnStatusCode: false,
          withCredentials: true
        }).then((response) => {
          console.log(response)
          expect(response.status).to.eq(200);
          });
      });      
    });

    it('TC-05 Verify the API will return 200 OK if we Update User Bio With Valid Token', function(){
      cy.get('@testData').then(function(testData){
        cy.get('@tokenData').then(function(tokenData){
          const { data } = testData;
          const { validToken } = tokenData;
      
          cy.request({
            method: 'PATCH',
            url: 'https://api.github.com/user',
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': 'Bearer ${validToken}', // Use validToken instead of token
              'X-GitHub-Api-Version': '2022-11-28',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data,
            withCredentials: true
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });
      
      
    });

});
