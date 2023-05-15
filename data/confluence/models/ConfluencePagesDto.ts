export type ConfluencePagesDto = {
  page: {
    results: ConfluencePageDto[];
  };
};

export type ConfluencePageDto = {
  id: string;
  title: string;
  history: {
    lastUpdated: {
      when: string;
    };
  };
  body: {
    view: {
      value: string;
    };
  };
  _links: {
    webui: string;
  };
};
