import { BioAppPage } from './app.po';

describe('bio-app App', function() {
  let page: BioAppPage;

  beforeEach(() => {
    page = new BioAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
