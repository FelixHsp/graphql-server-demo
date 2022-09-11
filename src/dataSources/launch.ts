import { RESTDataSource } from 'apollo-datasource-rest';

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  async getAllLaunches () {
    const launchList = await this.get('launches');
    return Array.isArray(launchList) ? launchList.map(launch => this.launchReducer(launch)) : [];
  }

  async getLaunchById(props: { launchId: string }) {
    const { launchId } = props;
    const launchList = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(launchList[0]);
  }

  private launchReducer (launch: any) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }
};

export default LaunchAPI;