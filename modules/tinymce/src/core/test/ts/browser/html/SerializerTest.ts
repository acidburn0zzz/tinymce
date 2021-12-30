import { describe, it } from '@ephox/bedrock-client';
import { assert } from 'chai';

import DomParser from 'tinymce/core/api/html/DomParser';
import Schema from 'tinymce/core/api/html/Schema';
import HtmlSerializer from 'tinymce/core/api/html/Serializer';

describe('browser.tinymce.core.html.SerializerTest', () => {
  it('Basic serialization', () => {
    const serializer = HtmlSerializer();

    assert.equal(serializer.serialize(DomParser().parse('text < text&')), 'text &lt; text&amp;');
    assert.equal(
      serializer.serialize(DomParser().parse('<B>text</B><IMG src="1.gif">')),
      '<strong>text</strong><img src="1.gif">'
    );
    assert.equal(serializer.serialize(DomParser().parse('<!-- comment -->')), '<!-- comment -->');
    assert.equal(serializer.serialize(DomParser().parse('<![CDATA[cdata]]>', { format: 'xhtml' })), '<![CDATA[cdata]]>');
    assert.equal(serializer.serialize(DomParser().parse('<?xml-stylesheet attr="value" ?>', { format: 'xhtml' })), '<?xml-stylesheet attr="value" ?>');
  });

  it('Sorting of attributes', () => {
    const serializer = HtmlSerializer();

    assert.equal(
      serializer.serialize(DomParser().parse('<b class="class" id="test-id">x</b>')),
      '<strong id="test-id" class="class">x</strong>'
    );
  });

  // TODO: TINY-4627/TINY-8383
  it.skip('Serialize with validate: true, when parsing with validate:false bug', () => {
    const schema = Schema({ valid_elements: 'b' });
    const serializer = HtmlSerializer({}, schema);

    assert.equal(
      serializer.serialize(DomParser({ validate: false }, schema).parse('<b a="1" b="2">a</b><i a="1" b="2">b</i>')),
      '<b a="1" b="2">a</b><i a="1" b="2">b</i>'
    );
  });
});
