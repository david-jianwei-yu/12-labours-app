describe('map viewer page', () =>{
  it('test scaffold is loaded', () => {
    cy.visit('/data/maps?type=scaffold&id=bfdb4f9a-1301-4c16-b9bd-0aa8e121c097&dataset_id=dataset-34-version-5');
    cy.wait(15000);
    cy.contains("3D Scaffold");
    // selected facets & result
    cy.get('.el-tag').find('span').should('contain', 'Young adult');
    cy.contains('Influence of direct colon tissue electrical stimulation on colonic motility in anesthetized male Yucatan minipig');
    // box in the bottom left corner
    cy.get('.traditional-container').should('contain', 'Regions');
    // content in the box
    cy.get('.el-tree-node__content').should('contain', 'distal colon');
    cy.get('.el-popover__reference-wrapper').find('svg');   // icon
    cy.get('canvas');
  })

  it('test flatmap is loaded', () => {
    cy.visit('/data/maps?type=flatmap&id=Rat');
    cy.wait(10000);
    cy.contains("MultiFlatmap");
    cy.get('.el-tag').find('span').should('contain', 'Rat');
    cy.get('.checkall-display-text').should('contain', 'Pathways');
    cy.get('.label-text').should('contain', 'CNS');
    cy.get('canvas');
  })
})