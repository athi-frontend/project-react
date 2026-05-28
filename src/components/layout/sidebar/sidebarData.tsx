import {
  Element4,
  DocumentText,
  TickSquare,
  Warning2,
  Setting2,
  Global,
} from 'iconsax-react'
import { MenuItem } from '@/types/components/layout/sidebar'
import { NUMBERMAP } from '@/constants/common'

export const menuItems: MenuItem[] = [
  {
    id: NUMBERMAP.ONE,
    icon: <Element4 variant="Outline" size={NUMBERMAP.TWENTYFOUR} color="currentColor" />,
    label: 'Dashboard',
    submenu: [
      {
        id: 'sub1',
        label: 'Statuses',
        submenu: [
          {
            id: '1-nested1',
            label: 'User Status',
            path: '/feasibilitystudy/create',
          },
          { id: '1-nested2', label: 'Task Status', path: '/table' },
        ],
      },
    ],
  },
  {
    id: NUMBERMAP.TWO,
    icon: <DocumentText variant="Outline" size={NUMBERMAP.TWENTYFOUR} color="currentColor" />,
    label: 'Document',
    submenu: [
      {
        id: 'sub2',
        label: 'Statuses',
        submenu: [
          { id: '2-nested3', label: 'User Status' },
          { id: '2-nested4', label: 'Task Status' },
        ],
      },
    ],
  },
  {
    id: NUMBERMAP.THREE,
    icon: <TickSquare variant="Outline" size={NUMBERMAP.TWENTYFOUR} color="currentColor" />,
    label: 'Check list',
    submenu: [
      {
        id: 'sub3',
        label: 'Statuses',
        submenu: [
          { id: '3-nested1', label: 'User Status' },
          { id: '3-nested2', label: 'Task Status' },
        ],
      },
    ],
  },
  {
    id: NUMBERMAP.FOUR,
    icon: <Warning2 variant="Outline" size={NUMBERMAP.TWENTYFOUR} color="currentColor" />,
    label: 'Warning',
    submenu: [
      {
        id: 'sub4',
        label: 'Statuses',
        submenu: [
          { id: '4-nested1', label: 'User Status' },
          { id: '4-nested2', label: 'Task Status' },
        ],
      },
    ],
  },
  {
    id: NUMBERMAP.FIVE,
    icon: <Setting2 variant="Outline" size={NUMBERMAP.TWENTYFOUR} color="currentColor" />,
    label: 'Settings',
    submenu: [
      {
        id: 'sub5',
        label: 'Statuses',
        submenu: [
          { id: '5-nested1', label: 'User Status' },
          { id: '5-nested2', label: 'Task Status' },
        ],
      },
    ],
  },
  {
    id: NUMBERMAP.SIX,
    icon: <Global variant="Outline" size={NUMBERMAP.TWENTYFOUR} color="currentColor" />,
    label: 'Global Data',
    submenu: [
      {
        id: 'sub6',
        label: 'Statuses',
        submenu: [
          { id: '6-nested1', label: 'User Status' },
          { id: '6-nested2', label: 'Task Status' },
        ],
      },
    ],
  },
]
