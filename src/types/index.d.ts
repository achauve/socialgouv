interface Check {
  name: string;
  id: string;
}

interface Repository {
  owner: string;
  name: string;
  full_name: string;
}

interface Push {
  sha: string;
  callback_url: string;
  repository: Repository;
}

interface Run {
  id: string;
  push: Push;
  check: Check;
}
