/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */

import { GitHub } from './GitHub';

// eslint-disable-next-line global-require
jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

const gitHubUserMock = require('./__fixtures__/gitHubUser.json');
const gitHubReposMock = require('./__fixtures__/gitHubRepos.json');

const gitHub = new GitHub({
  baseUrl: 'https://api.github.com',
  personalAccessToken: 'personal-access-token',
});

describe('getData', () => {
  it('gets GitHub data using API', async () => {
    fetchMock.get('https://api.github.com/user', gitHubUserMock);
    fetchMock.get('https://api.github.com/user/repos', gitHubReposMock);

    const data = await gitHub.getData();

    fetchMock.reset();

    expect(data).toStrictEqual(
      expect.objectContaining({
        homepageUrl: 'https://loginov.rocks',
        url: 'https://github.com/loginov-rocks',
        user: 'loginov-rocks',
      }),
    );
    expect(typeof data.timestamp).toBe('number');

    expect(Array.isArray(data.repos)).toBeTruthy();
    expect(data.repos.length).toBe(30);

    expect(data.repos[0]).toStrictEqual({
      description: 'Clean but full featured AngularJS boilerplate using Gulp workflow and best practices',
      homepageUrl: 'https://www.npmjs.com/package/angular-gulp-boilerplate',
      language: 'JavaScript',
      latestVersion: '',
      stars: 29,
      title: 'Angular-Gulp-Boilerplate',
      updatedAt: 1613486363000,
      url: 'https://github.com/loginov-rocks/Angular-Gulp-Boilerplate',
    });

    expect(data.repos).toMatchSnapshot();
  });
});
