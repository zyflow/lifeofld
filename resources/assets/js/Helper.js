// import 'datatables';

import React from 'react';

export function customSelections() {
    $("select").each(function() {
        var className = Math.random().toString(36).substr(2, 10);

        $(this).addClass(className);
        $("<div class='" + className + " other-select'></div>").insertBefore($(this));

        $(".other-select." + className).append("<span></span>");
        $(".other-select." + className + " span").text($(this).find("option:selected").text());
        $(".other-select." + className).append("<ul></ul>");

        $(this).find("option").each(function() {
            $(".other-select." + className + " ul").append("<li data-value='" + $(this).val() + "'>" + $(this).text() + "</li>");
        })
    })

    $(".other-select span").click(function() {
        $(this).toggleClass("active");
        $(this).parent().find("ul").fadeToggle();
    });

    $(".other-select ul li").click(function() {
        $("select." + $(this).parent().parent().attr("class").split(' ')[0]).find("option[value='" + $(this).data("value") + "']").prop("selected", "true").change();
        $(this).parent().fadeOut();
        $(this).parent().parent().find("span").toggleClass("active").text($(this).text());
    });
}

export function dataTables() {
    $('#data-table').DataTable( {
        retrieve: true,
        "pageLength": 15,
        "autoWidth": false,
        "language": {
            "paginate": {
                "previous": "",
                "next": ""
            }
        }
    });
}

export function parseDate(str) {
    return new Date(str);
}

export function dateDiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

export function counterEffect() {
    $('.counter .number').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}

function SelectOptions(props)
{
    return (
        <option key={props.id} value={props.id} >{props.value}</option>
    );
}

export function SelectInput(props)
{
    let options = props.value;
    let savedValue = '';
    if (props.savedValue)
    {
        savedValue = props.savedValue;
    }

    const listItems =  <SelectOptions key="" id="" value="" />;

    if (typeof options !== 'undefined')
    {
        const listItems = options.map((manager) =>
            <SelectOptions key={manager.id} id={manager.id} value={manager.name + " " + manager.surname} />
        );
    }

    return (
        <div className="field">
            <label htmlFor={props.id}>{props.label}</label>
            <select name={props.id}
                    id={props.id}
                    defaultValue={savedValue}>
                {listItems}
            </select>
        </div>
    );
}

export function TextInput(props)
{
    return (
        <div className="field">
            <label htmlFor={props.id}>{props.label}</label>
            <input type="text"
                   name={props.id}
                   id={props.id}
                   defaultValue={props.value}
            />
        </div>
    );
}

export function NumberInput(props) {
    return (
        <div className="field">
            <label htmlFor={props.id}>{props.label}</label>
            <input type="number"
                   name={props.id}
                   id={props.id}
                   defaultValue={props.value} />
        </div>
    );
}

export function FileList(props)
{
    const files = props.files;
    const listItems = files.map((file) =>
        <LinkListItem key={file.id} value={file.file}/>
    );

    return (
        <ul>
            {listItems}
        </ul>
    );
}

function LinkListItem(props)
{
    return (
        <a target="_blank" href={"/storage/files/" + props.value}>
            <ListItem key={props.value} value={props.value}/>
        </a>
    );
}

function ListItem(props)
{
    return (
        <li>
            {props.value}
        </li>
    );
}

export function trans(group, value)
{
    let translatedValue = group + '_' + value;
    if (typeof translations[group] !== 'undefined' && typeof translations[group][value] !== 'undefined')
    {
        translatedValue = translations[group][value];
    }

    return translatedValue;
}

