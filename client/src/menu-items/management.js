// assets
import { IconBuildingStore, IconUserCircle, IconBoxSeam, IconTableOptions } from '@tabler/icons';

// constant
const icons = {
  IconBoxSeam,
  IconBuildingStore,
  IconUserCircle,
  IconTableOptions
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const management = {
  id: 'management',
  title: 'Management',
  type: 'group',
  children: [
    {
      id: 'goods',
      title: 'Goods',
      type: 'item',
      url: '/goods',
      icon: icons.IconBoxSeam,
      breadcrumbs: false
    },
    {
      id: 'good_types',
      title: 'Type of goods',
      type: 'item',
      url: '/goodtypes',
      icon: icons.IconTableOptions,
      breadcrumbs: false
    },
    {
      id: 'stores',
      title: 'Stores',
      type: 'item',
      url: '/stores',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.IconUserCircle,
      breadcrumbs: false
    }
  ]
};

export default management;
