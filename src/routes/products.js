const { Router } = require("express");
const axios = require("axios");
const router = Router();

const products = [
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
  {
    _id: { $oid: "5ef259a08997f12de40d332a" },
    desc: {
      short: "This is a very useful testing product",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nisl diam, molestie eu erat et, dapibus congue tortor. Nam rutrum cursus dapibus. Sed ut bibendum orci. Duis rutrum lorem massa, id pellentesque orci mattis sit amet. Pellentesque elementum turpis eget leo consequat tempus. Integer mollis lacus quis blandit aliquet. Fusce molestie interdum leo a ullamcorper. Etiam quis nibh tellus.Duis suscipit finibus tellus, non dapibus massa imperdiet ut. Aliquam fringilla lobortis ante. Sed in molestie mi. Mauris fermentum vitae est et lacinia. Aliquam in nulla et neque feugiat cursus. Etiam id suscipit tellus. In vitae venenatis diam. Donec sit amet nisl lacinia, convallis nibh et, vestibulum risus. Vivamus metus lectus, accumsan sit amet quam et, blandit placerat lorem. Nullam egestas nunc ac consectetur mattis. Morbi finibus est at pellentesque euismod.Donec in ligula sit amet orci pretium volutpat. Suspendisse nec venenatis augue. Morbi rutrum, nisi non sagittis mattis, nulla est placerat ante, vel viverra arcu sapien et magna. Fusce ac accumsan massa, vel tincidunt lacus. Etiam accumsan felis at lectus semper interdum. Vestibulum eros leo, hendrerit at nunc at, interdum feugiat velit. Vivamus fringilla odio eget facilisis rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam mollis sodales nulla nec imperdiet. In in fermentum erat. Etiam condimentum velit non justo pulvinar, vitae tincidunt libero elementum. Sed ullamcorper congue lacus vehicula bibendum. Nullam et ultrices lorem. Nam tristique et sapien non aliquet. In in nunc ac velit ornare feugiat nec sit amet urna. Nulla efficitur a nunc quis egestas. Praesent mattis ex at odio pretium faucibus. Etiam tristique tellus facilisis sapien mattis maximus. Donec nec lorem lorem. Nulla feugiat eros nisi, molestie ullamcorper purus venenatis at. Morbi ornare lacus dolor, ac aliquam quam consequat a. Maecenas in dictum enim. Cras luctus gravida tincidunt. Suspendisse sit amet egestas mi. Mauris lorem nibh, porta id gravida sit amet, consequat eget eros. Morbi augue tellus, rhoncus et arcu sed, convallis molestie risus. Pellentesque sed turpis in est euismod aliquet. Integer pretium vel massa nec laoreet. Proin ultrices elit vel tellus congue convallis. Maecenas posuere arcu sit amet dui lobortis accumsan. Ut condimentum lectus vel mattis congue.",
    },
    price: 5,
    features: [
      "Comes with free hosting",
      "Has extensive help command",
      "Is very useful",
      "Super fast",
    ],
    slag: "test_product",
    name: "Test Product",
    createdTimestamp: "1592940804437",
    id: "9SnvdB-ea",
  },
];

router.get("/", async (req, res) => {
  const resp = await axios.get("/api/products");
  res.render("products", {
    user: req.user,
    products,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

module.exports = router;
