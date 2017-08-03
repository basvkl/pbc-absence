import { AbsenceCliPage } from './app.po';

describe('absence-cli App', () => {
  let page: AbsenceCliPage;

  beforeEach(() => {
    page = new AbsenceCliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
